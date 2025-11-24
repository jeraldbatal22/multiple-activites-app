import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Pokemon {
  id: string;
  title?: string;
  description: string;
  pokemon_image_url?: string | null;
  created_at: string;
}

export interface PokemonReview {
  id: string;
  pokemon_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

interface PokemonState {
  pokemons: Pokemon[];
  selectedPokemon: Pokemon | null;
  pokemonReviews: PokemonReview[];
  selectedPokemonReview: PokemonReview | null; // reviews for currently selected pokemon, e.g. for panel
}

const initialState: PokemonState = {
  pokemons: [],
  selectedPokemon: null,
  pokemonReviews: [],
  selectedPokemonReview: null,
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setPokemons: (state, action: PayloadAction<Pokemon[]>) => {
      state.pokemons = action.payload;
    },
    setSelectedPokemon: (state, action: PayloadAction<Pokemon | null>) => {
      state.selectedPokemon = action.payload;
    },
    addPokemon: (state, action: PayloadAction<Pokemon>) => {
      state.pokemons.push(action.payload);
    },
    removePokemonById: (state, action: PayloadAction<string>) => {
      state.pokemons = state.pokemons.filter(pokemon => pokemon.id !== action.payload);
      if (state.selectedPokemon?.id === action.payload) {
        state.selectedPokemon = null;
      }
    },
    setPokemonReviews: (state, action: PayloadAction<PokemonReview[]>) => {
      state.pokemonReviews = action.payload;
    },
    setSelectedPokemonReview: (state, action: PayloadAction<PokemonReview>) => {
      state.selectedPokemonReview = action.payload;
    },
  },
});

export const {
  setPokemons,
  setSelectedPokemon,
  addPokemon,
  removePokemonById,
  setPokemonReviews,
  setSelectedPokemonReview,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
