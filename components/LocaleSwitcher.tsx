// Locale switcher component for internationalization

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, Check } from 'lucide-react'

interface Locale {
  code: string
  name: string
  flag: string
  nativeName: string
}

interface LocaleSwitcherProps {
  selectedLocale: string
  onLocaleChange: (locale: string) => void
  locales?: Locale[]
}

const defaultLocales: Locale[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭', nativeName: 'Filipino' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿', nativeName: 'Kiswahili' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', nativeName: 'አማርኛ' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', nativeName: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', nativeName: 'Igbo' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', nativeName: 'Hausa' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', nativeName: 'isiZulu' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', nativeName: 'Afrikaans' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', nativeName: 'Čeština' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', nativeName: 'Română' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', nativeName: 'Hrvatski' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', nativeName: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', nativeName: 'Slovenščina' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', nativeName: 'Lietuvių' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', nativeName: 'فارسی' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', flag: '🇮🇳', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳', nativeName: 'অসমীয়া' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰', nativeName: 'සිංහල' },
  { code: 'my', name: 'Burmese', flag: '🇲🇲', nativeName: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', nativeName: 'ລາວ' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲', nativeName: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', nativeName: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿', nativeName: 'Қазақ' },
  { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬', nativeName: 'Кыргызча' },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿', nativeName: 'Oʻzbek' },
  { code: 'tg', name: 'Tajik', flag: '🇹🇯', nativeName: 'Тоҷикӣ' },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳', nativeName: 'Монгол' },
]

export function LocaleSwitcher({ 
  selectedLocale, 
  onLocaleChange,
  locales = defaultLocales 
}: LocaleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const selectedLocaleData = locales.find(l => l.code === selectedLocale) || locales[0]
  
  const filteredLocales = locales.filter(locale =>
    locale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    locale.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    locale.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLocaleSelect = (localeCode: string) => {
    onLocaleChange(localeCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Globe className="h-4 w-4" />
        <span className="text-lg">{selectedLocaleData.flag}</span>
        <span>{selectedLocaleData.code.toUpperCase()}</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Language</CardTitle>
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredLocales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => handleLocaleSelect(locale.code)}
                  className={`w-full flex items-center justify-between p-2 rounded-md text-sm hover:bg-gray-50 ${
                    selectedLocale === locale.code ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{locale.flag}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{locale.name}</span>
                      <span className="text-xs text-gray-500">{locale.nativeName}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {locale.code.toUpperCase()}
                    </Badge>
                    {selectedLocale === locale.code && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredLocales.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No languages found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            )}

            {/* Current selection */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Selected:</span>
                <Badge variant="secondary" className="flex items-center space-x-2">
                  <span className="text-lg">{selectedLocaleData.flag}</span>
                  <span>{selectedLocaleData.code.toUpperCase()}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
