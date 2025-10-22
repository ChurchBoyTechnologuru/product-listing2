// Currency selector component for international marketplace

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Currency } from '@/lib/types'

interface CurrencySelectorProps {
  selectedCurrency: string
  onCurrencyChange: (currency: string) => void
  currencies?: Currency[]
}

const defaultCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 20.1 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1180 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.8 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.42 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 8.5 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 8.7 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 6.3 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', rate: 3.9 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', rate: 21.5 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', rate: 300 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 73.5 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 8.5 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 14.8 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', rate: 15.7 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 410 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 110 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', rate: 5.9 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', rate: 9.1 },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', rate: 2.8 },
]

export function CurrencySelector({ 
  selectedCurrency, 
  onCurrencyChange,
  currencies = defaultCurrencies 
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[0]
  
  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
  const popularCurrenciesData = currencies.filter(c => popularCurrencies.includes(c.code))
  
  const otherCurrencies = currencies.filter(c => !popularCurrencies.includes(c.code))

  const handleCurrencySelect = (currencyCode: string) => {
    onCurrencyChange(currencyCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <span className="text-lg">{selectedCurrencyData.symbol}</span>
        <span>{selectedCurrencyData.code}</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Currency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Popular currencies */}
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Popular
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {popularCurrenciesData.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencySelect(currency.code)}
                    className={`flex items-center justify-between p-2 rounded-md text-sm hover:bg-gray-50 ${
                      selectedCurrency === currency.code ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{currency.symbol}</span>
                      <span>{currency.code}</span>
                    </div>
                    <span className="text-xs text-gray-500">{currency.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* All currencies */}
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                All Currencies
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {otherCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencySelect(currency.code)}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-sm hover:bg-gray-50 ${
                      selectedCurrency === currency.code ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{currency.symbol}</span>
                      <span>{currency.code}</span>
                    </div>
                    <span className="text-xs text-gray-500">{currency.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current selection */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Selected:</span>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span className="text-lg">{selectedCurrencyData.symbol}</span>
                  <span>{selectedCurrencyData.code}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
