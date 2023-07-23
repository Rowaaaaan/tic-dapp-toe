// I'm a techbro now
use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

declare_id!("CwnZBvhPLva1bSUiunhvatsBAL4o7LspALj1BgQpa3AP");

#[program]
pub mod tic_tac_toe {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn setup_game(ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
        ctx.accounts
            .game
            .start([ctx.accounts.player_one.key(), player_two])
    }

    pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
        let game = &mut ctx.accounts.game;

        require_keys_eq!(
            game.current_player(),
            ctx.accounts.player.key(),
            TicTacToeError::NotPlayersTurn
        );

        game.play(&tile)
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct Game {
    players: [Pubkey; 2],
    turn: u8,
    // A 3x3 grid representing the board
    board: [[Option<Sign>; 3]; 3],
    state: GameState,
}

#[derive(Accounts)]
pub struct SetupGame<'info> {
    // Make a rent-exempt account for the program, and charge the first player for it
    #[account(init, payer = player_one, space = 8 + Game::MAXIMUM_SIZE)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player_one: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

// Enum that keeps track of the game's state
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameState {
    Active,
    Tie,
    // Pubkey of the player that won
    Won { winner: Pubkey },
}

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq,
)]
pub enum Sign {
    X,
    O,
}

impl Game {
    // This is the space that the game data will take on the blockchain.
    // It is based on Borsh's serialization specification.
    // Each data point must be discriminated by a byte to signify a separator
    // --e.g. data1|data2|data3, etc.
    // so that when deserializing, the data can be distinguished from each other.
    //
    // The total size is computed by the following
    // Pubkey size 32 * (1 byte for the actual data + 1 byte for the discriminant) = 64
    // u8 vector is represented with 1 byte
    // 9 tiles in the grid * (1 byte for the tile + 1 byte for the discriminant)
    // 32 bytes for the winner Pubkey + 1 for the discriminant
    pub const MAXIMUM_SIZE: usize = (32 * 2) + 1 + (9 * (1 + 1)) + (32 + 1);

    // Start the game
    pub fn start(&mut self, players: [Pubkey; 2]) -> Result<()> {
        require_eq!(self.turn, 0, TicTacToeError::GameAlreadyStarted);
        self.players = players;
        self.turn = 1;
        Ok(())
    }

    pub fn is_active(&self) -> bool {
        self.state == GameState::Active
    }

    fn current_player_index(&self) -> usize {
        ((self.turn - 1) % 2) as usize
    }

    pub fn current_player(&self) -> Pubkey {
        self.players[self.current_player_index()]
    }

    pub fn play(&mut self, tile: &Tile) -> Result<()> {
        require!(self.is_active(), TicTacToeError::GameAlreadyOver);

        match tile {
            // Destructure tile, and check if its row/column is within the board
            tile @ Tile {
                row: 0..=2,
                column: 0..=2,
            } => match self.board[tile.row as usize][tile.column as usize] {
                // The tile is already set
                Some(_) => return Err(TicTacToeError::TileAlreadySet.into()),
                // the tile is empty
                None => {
                    self.board[tile.row as usize][tile.column as usize] =
                        Some(Sign::from_usize(self.current_player_index()).unwrap());
                }
            },
            _ => return Err(TicTacToeError::TileOutOfBounds.into()),
        }

        self.update_state();

        if GameState::Active == self.state {
            self.turn += 1;
        }

        Ok(())
    }

    fn is_winning_trio(&self, trio: [(usize, usize); 3]) -> bool {
        let [first, second, third] = trio;

        // Check if the signs are equal
        self.board[first.0][first.1].is_some()
            && self.board[first.0][first.1] == self.board[second.0][second.1]
            && self.board[first.0][first.1] == self.board[third.0][third.1]
    }

    fn update_state(&mut self) {
        for i in 0..=2 {
            // three of the same in one row
            if self.is_winning_trio([(i, 0), (i, 1), (i, 2)]) {
                self.state = GameState::Won {
                    winner: self.current_player(),
                };
                return;
            }
            // three of the same in one column
            if self.is_winning_trio([(0, i), (1, i), (2, i)]) {
                self.state = GameState::Won {
                    winner: self.current_player(),
                };
                return;
            }
        }

        // three of the same in one diagonal
        if self.is_winning_trio([(0, 0), (1, 1), (2, 2)])
            || self.is_winning_trio([(0, 2), (1, 1), (2, 0)])
        {
            self.state = GameState::Won {
                winner: self.current_player(),
            };
            return;
        }

        // reaching this code means the game has not been won,
        // so if there are unfilled tiles left, it's still active
        for row in 0..=2 {
            for column in 0..=2 {
                if self.board[row][column].is_none() {
                    return;
                }
            }
        }

        // game has not been won
        // game has no more free tiles
        // -> game ends in a tie
        self.state = GameState::Tie;
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct Tile {
    row: u8,
    column: u8,
}

#[error_code]
pub enum TicTacToeError {
    TileOutOfBounds,
    TileAlreadySet,
    GameAlreadyOver,
    NotPlayersTurn,
    GameAlreadyStarted,
}
