/*
  # Create tournaments database schema

  1. New Tables
    - `tournaments`
      - `id` (uuid, primary key)
      - `name` (text, tournament name)
      - `description` (text, tournament description)
      - `game` (text, game type)
      - `format` (text, tournament format)
      - `max_teams` (integer, maximum teams allowed)
      - `team_size` (integer, players per team)
      - `prize_pool` (text, prize information)
      - `entry_fee` (numeric, entry cost)
      - `start_date` (timestamptz, tournament start)
      - `end_date` (timestamptz, tournament end)
      - `registration_deadline` (timestamptz, registration cutoff)
      - `status` (text, tournament status)
      - `organizer` (text, organizer name)
      - `rules` (text, tournament rules)
      - `min_rank` (text, minimum rank requirement)
      - `max_rank` (text, maximum rank requirement)
      - `region` (text, tournament region)
      - `featured` (boolean, featured status)
      - `banner_image` (text, banner URL)
      - `sponsors` (jsonb, sponsor list)
      - `socials` (jsonb, social media links)
      - `created_at` (timestamptz, creation time)
      - `updated_at` (timestamptz, last update)

    - `tournament_teams`
      - `id` (uuid, primary key)
      - `tournament_id` (uuid, foreign key to tournaments)
      - `name` (text, team name)
      - `captain_id` (text, captain identifier)
      - `avatar` (text, team avatar URL)
      - `created_at` (timestamptz, creation time)

    - `team_players`
      - `id` (uuid, primary key)
      - `team_id` (uuid, foreign key to tournament_teams)
      - `username` (text, player username)
      - `valorant_tracker` (text, tracker URL)
      - `rank_tier` (text, rank tier)
      - `rank_division` (integer, rank division)
      - `rank_name` (text, display rank name)
      - `rank_color` (text, rank color)
      - `rank_icon` (text, rank icon URL)
      - `rr` (integer, rank rating)
      - `avatar` (text, player avatar URL)
      - `discord_tag` (text, Discord username)
      - `verified` (boolean, verification status)
      - `is_captain` (boolean, captain status)
      - `created_at` (timestamptz, creation time)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated write access

  3. Relationships
    - tournament_teams.tournament_id -> tournaments.id
    - team_players.team_id -> tournament_teams.id
*/

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  game text NOT NULL,
  format text NOT NULL,
  max_teams integer NOT NULL,
  team_size integer NOT NULL,
  prize_pool text,
  entry_fee numeric,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  registration_deadline timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'upcoming',
  organizer text NOT NULL,
  rules text NOT NULL,
  min_rank text,
  max_rank text,
  region text NOT NULL,
  featured boolean DEFAULT false,
  banner_image text,
  sponsors jsonb DEFAULT '[]'::jsonb,
  socials jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tournament_teams table
CREATE TABLE IF NOT EXISTS tournament_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name text NOT NULL,
  captain_id text NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now()
);

-- Create team_players table
CREATE TABLE IF NOT EXISTS team_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES tournament_teams(id) ON DELETE CASCADE,
  username text NOT NULL,
  valorant_tracker text,
  rank_tier text NOT NULL,
  rank_division integer NOT NULL,
  rank_name text NOT NULL,
  rank_color text NOT NULL,
  rank_icon text NOT NULL,
  rr integer NOT NULL DEFAULT 0,
  avatar text,
  discord_tag text,
  verified boolean DEFAULT false,
  is_captain boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;

-- Create policies for tournaments
CREATE POLICY "Anyone can read tournaments"
  ON tournaments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create tournaments"
  ON tournaments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update tournaments"
  ON tournaments
  FOR UPDATE
  TO public
  USING (true);

-- Create policies for tournament_teams
CREATE POLICY "Anyone can read tournament teams"
  ON tournament_teams
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create tournament teams"
  ON tournament_teams
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update tournament teams"
  ON tournament_teams
  FOR UPDATE
  TO public
  USING (true);

-- Create policies for team_players
CREATE POLICY "Anyone can read team players"
  ON team_players
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create team players"
  ON team_players
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update team players"
  ON team_players
  FOR UPDATE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament_id ON tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_team_players_team_id ON team_players(team_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_featured ON tournaments(featured);
CREATE INDEX IF NOT EXISTS idx_tournaments_created_at ON tournaments(created_at);