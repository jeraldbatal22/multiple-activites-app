import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Food {
  id: string;
  title?: string;
  user_id: string;
  description?: string;
  food_image_url?: string | null;
  created_at: string;
}

export interface FoodReview {
  id: string;
  food_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

interface FoodState {
  foods: Food[];
  selectedFood: Food | null;
  foodReviews: FoodReview[];
  selectedFoodReview: FoodReview | null; // reviews for currently selected food, e.g. for panel
}

const initialState: FoodState = {
  foods: [],
  selectedFood: null,
  foodReviews: [],
  selectedFoodReview: null,
};

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    setFoods: (state, action: PayloadAction<Food[]>) => {
      state.foods = action.payload;
    },
    setSelectedFood: (state, action: PayloadAction<Food | null>) => {
      state.selectedFood = action.payload;
    },
    addFood: (state, action: PayloadAction<Food>) => {
      state.foods.push(action.payload);
    },
    removeFoodById: (state, action: PayloadAction<string>) => {
      state.foods = state.foods.filter((food) => food.id !== action.payload);
      if (state.selectedFood?.id === action.payload) {
        state.selectedFood = null;
      }
    },
    setFoodReviews: (state, action: PayloadAction<FoodReview[]>) => {
      state.foodReviews = action.payload;
    },
    setSelectedFoodReview: (state, action: PayloadAction<FoodReview>) => {
      state.selectedFoodReview = action.payload;
    },
  },
});

export const {
  setFoods,
  setSelectedFood,
  addFood,
  removeFoodById,
  setFoodReviews,
  setSelectedFoodReview,
} = foodSlice.actions;

export default foodSlice.reducer;
