import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ErrorState } from '../type'

const initialState: ErrorState = {
    error: ''
} 

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state: ErrorState, action: PayloadAction<string>) => {
      return {
        error: action.payload
      }
    },
    clearError: () => {
        return {
          error: ''
        }
      }
  },
})

export const { setError, clearError } = errorSlice.actions

export default errorSlice.reducer