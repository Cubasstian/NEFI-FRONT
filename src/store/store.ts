import { create } from 'zustand'

interface BearState {
  blackBears: number
  polarBears: number
  pandaBears: number
  increase: (by: number) => void
}

export const useBearStore = create<BearState>()((set) => ({
  blackBears: 10,
  polarBears: 5,
  pandaBears: 1,
  increase: (by: number) => set((state) => ({ blackBears: state.blackBears + by })),
  
}))