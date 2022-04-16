import { UserAttributes, UserInfoDTO, UserState } from '@/features/user/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: UserState = {
  currentUser: {} as UserAttributes & UserInfoDTO,
  authenticated: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state: UserState, action: PayloadAction<UserAttributes>) => {
      return {
        ...state,
        currentUser: action.payload,
        authenticated: Object.keys(action.payload).length > 0 &&
          action.payload.fullAuthenticated ?
          true :
          false,
      };
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentUser } = userSlice.actions

export default userSlice.reducer