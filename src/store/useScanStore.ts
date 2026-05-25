import { create } from 'zustand';
import type { ScanResult } from '@/types';

interface ScanState {
  // Scanner state
  selectedImage: File | null;
  imagePreview: string | null;
  isScanning: boolean;
  scanProgress: number;
  scanStage: 'idle' | 'uploading' | 'analyzing' | 'detecting' | 'reasoning' | 'complete';
  result: ScanResult | null;
  scanHistory: ScanResult[];

  // Actions
  setImage: (file: File | null) => void;
  startScan: () => void;
  setScanProgress: (progress: number) => void;
  setScanStage: (stage: ScanState['scanStage']) => void;
  setResult: (result: ScanResult) => void;
  resetScan: () => void;
  addToHistory: (result: ScanResult) => void;
}

export const useScanStore = create<ScanState>((set) => ({
  selectedImage: null,
  imagePreview: null,
  isScanning: false,
  scanProgress: 0,
  scanStage: 'idle',
  result: null,
  scanHistory: [],

  setImage: (file) =>
    set({
      selectedImage: file,
      imagePreview: file ? URL.createObjectURL(file) : null,
      result: null,
      scanStage: 'idle',
      scanProgress: 0,
    }),

  startScan: () =>
    set({
      isScanning: true,
      scanProgress: 0,
      scanStage: 'uploading',
      result: null,
    }),

  setScanProgress: (scanProgress) => set({ scanProgress }),

  setScanStage: (scanStage) => set({ scanStage }),

  setResult: (result) =>
    set((state) => ({
      result,
      isScanning: false,
      scanStage: 'complete',
      scanProgress: 100,
      scanHistory: [result, ...state.scanHistory],
    })),

  resetScan: () =>
    set({
      selectedImage: null,
      imagePreview: null,
      isScanning: false,
      scanProgress: 0,
      scanStage: 'idle',
      result: null,
    }),

  addToHistory: (result) =>
    set((state) => ({
      scanHistory: [result, ...state.scanHistory],
    })),
}));
