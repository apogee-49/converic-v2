export interface Settings {
  meta: {
    title: string
    description: string
    keywords: string[]
    indexed: boolean
  }
  layout: {
    favicon: string
    primaryColor: string
    secondaryColor: string
    buttonRadius: 'none' | 'medium' | 'full'
  }
}

export interface MetaSectionProps {
  settings: Settings
  setSettings: (settings: Settings) => void
  isLoading: boolean
  onSave: () => void
  isSaving: boolean
  hasChanges: boolean
}

export interface LayoutSectionProps {
  settings: Settings
  setSettings: (settings: Settings) => void
  isLoading: boolean
  onSave: () => void
  isSaving: boolean
  hasChanges: boolean
}