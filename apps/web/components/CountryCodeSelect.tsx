'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface CountryCode {
  code: string;
  name: string;
  country: string;
}

// Полный список всех телефонных кодов стран
const countryCodes: CountryCode[] = [
  { code: '+1', name: 'United States', country: 'US' },
  { code: '+1', name: 'Canada', country: 'CA' },
  { code: '+7', name: 'Russia', country: 'RU' },
  { code: '+7', name: 'Kazakhstan', country: 'KZ' },
  { code: '+20', name: 'Egypt', country: 'EG' },
  { code: '+27', name: 'South Africa', country: 'ZA' },
  { code: '+30', name: 'Greece', country: 'GR' },
  { code: '+31', name: 'Netherlands', country: 'NL' },
  { code: '+32', name: 'Belgium', country: 'BE' },
  { code: '+33', name: 'France', country: 'FR' },
  { code: '+34', name: 'Spain', country: 'ES' },
  { code: '+36', name: 'Hungary', country: 'HU' },
  { code: '+39', name: 'Italy', country: 'IT' },
  { code: '+40', name: 'Romania', country: 'RO' },
  { code: '+41', name: 'Switzerland', country: 'CH' },
  { code: '+43', name: 'Austria', country: 'AT' },
  { code: '+44', name: 'United Kingdom', country: 'GB' },
  { code: '+45', name: 'Denmark', country: 'DK' },
  { code: '+46', name: 'Sweden', country: 'SE' },
  { code: '+47', name: 'Norway', country: 'NO' },
  { code: '+48', name: 'Poland', country: 'PL' },
  { code: '+49', name: 'Germany', country: 'DE' },
  { code: '+51', name: 'Peru', country: 'PE' },
  { code: '+52', name: 'Mexico', country: 'MX' },
  { code: '+53', name: 'Cuba', country: 'CU' },
  { code: '+54', name: 'Argentina', country: 'AR' },
  { code: '+55', name: 'Brazil', country: 'BR' },
  { code: '+56', name: 'Chile', country: 'CL' },
  { code: '+57', name: 'Colombia', country: 'CO' },
  { code: '+58', name: 'Venezuela', country: 'VE' },
  { code: '+60', name: 'Malaysia', country: 'MY' },
  { code: '+61', name: 'Australia', country: 'AU' },
  { code: '+62', name: 'Indonesia', country: 'ID' },
  { code: '+63', name: 'Philippines', country: 'PH' },
  { code: '+64', name: 'New Zealand', country: 'NZ' },
  { code: '+65', name: 'Singapore', country: 'SG' },
  { code: '+66', name: 'Thailand', country: 'TH' },
  { code: '+81', name: 'Japan', country: 'JP' },
  { code: '+82', name: 'South Korea', country: 'KR' },
  { code: '+84', name: 'Vietnam', country: 'VN' },
  { code: '+86', name: 'China', country: 'CN' },
  { code: '+90', name: 'Turkey', country: 'TR' },
  { code: '+91', name: 'India', country: 'IN' },
  { code: '+92', name: 'Pakistan', country: 'PK' },
  { code: '+93', name: 'Afghanistan', country: 'AF' },
  { code: '+94', name: 'Sri Lanka', country: 'LK' },
  { code: '+95', name: 'Myanmar', country: 'MM' },
  { code: '+98', name: 'Iran', country: 'IR' },
  { code: '+212', name: 'Morocco', country: 'MA' },
  { code: '+213', name: 'Algeria', country: 'DZ' },
  { code: '+216', name: 'Tunisia', country: 'TN' },
  { code: '+218', name: 'Libya', country: 'LY' },
  { code: '+220', name: 'Gambia', country: 'GM' },
  { code: '+221', name: 'Senegal', country: 'SN' },
  { code: '+222', name: 'Mauritania', country: 'MR' },
  { code: '+223', name: 'Mali', country: 'ML' },
  { code: '+224', name: 'Guinea', country: 'GN' },
  { code: '+225', name: 'Ivory Coast', country: 'CI' },
  { code: '+226', name: 'Burkina Faso', country: 'BF' },
  { code: '+227', name: 'Niger', country: 'NE' },
  { code: '+228', name: 'Togo', country: 'TG' },
  { code: '+229', name: 'Benin', country: 'BJ' },
  { code: '+230', name: 'Mauritius', country: 'MU' },
  { code: '+231', name: 'Liberia', country: 'LR' },
  { code: '+232', name: 'Sierra Leone', country: 'SL' },
  { code: '+233', name: 'Ghana', country: 'GH' },
  { code: '+234', name: 'Nigeria', country: 'NG' },
  { code: '+235', name: 'Chad', country: 'TD' },
  { code: '+236', name: 'Central African Republic', country: 'CF' },
  { code: '+237', name: 'Cameroon', country: 'CM' },
  { code: '+238', name: 'Cape Verde', country: 'CV' },
  { code: '+239', name: 'São Tomé and Príncipe', country: 'ST' },
  { code: '+240', name: 'Equatorial Guinea', country: 'GQ' },
  { code: '+241', name: 'Gabon', country: 'GA' },
  { code: '+242', name: 'Republic of the Congo', country: 'CG' },
  { code: '+243', name: 'Democratic Republic of the Congo', country: 'CD' },
  { code: '+244', name: 'Angola', country: 'AO' },
  { code: '+245', name: 'Guinea-Bissau', country: 'GW' },
  { code: '+246', name: 'British Indian Ocean Territory', country: 'IO' },
  { code: '+248', name: 'Seychelles', country: 'SC' },
  { code: '+249', name: 'Sudan', country: 'SD' },
  { code: '+250', name: 'Rwanda', country: 'RW' },
  { code: '+251', name: 'Ethiopia', country: 'ET' },
  { code: '+252', name: 'Somalia', country: 'SO' },
  { code: '+253', name: 'Djibouti', country: 'DJ' },
  { code: '+254', name: 'Kenya', country: 'KE' },
  { code: '+255', name: 'Tanzania', country: 'TZ' },
  { code: '+256', name: 'Uganda', country: 'UG' },
  { code: '+257', name: 'Burundi', country: 'BI' },
  { code: '+258', name: 'Mozambique', country: 'MZ' },
  { code: '+260', name: 'Zambia', country: 'ZM' },
  { code: '+261', name: 'Madagascar', country: 'MG' },
  { code: '+262', name: 'Réunion', country: 'RE' },
  { code: '+263', name: 'Zimbabwe', country: 'ZW' },
  { code: '+264', name: 'Namibia', country: 'NA' },
  { code: '+265', name: 'Malawi', country: 'MW' },
  { code: '+266', name: 'Lesotho', country: 'LS' },
  { code: '+267', name: 'Botswana', country: 'BW' },
  { code: '+268', name: 'Swaziland', country: 'SZ' },
  { code: '+269', name: 'Comoros', country: 'KM' },
  { code: '+290', name: 'Saint Helena', country: 'SH' },
  { code: '+291', name: 'Eritrea', country: 'ER' },
  { code: '+297', name: 'Aruba', country: 'AW' },
  { code: '+298', name: 'Faroe Islands', country: 'FO' },
  { code: '+299', name: 'Greenland', country: 'GL' },
  { code: '+350', name: 'Gibraltar', country: 'GI' },
  { code: '+351', name: 'Portugal', country: 'PT' },
  { code: '+352', name: 'Luxembourg', country: 'LU' },
  { code: '+353', name: 'Ireland', country: 'IE' },
  { code: '+354', name: 'Iceland', country: 'IS' },
  { code: '+355', name: 'Albania', country: 'AL' },
  { code: '+356', name: 'Malta', country: 'MT' },
  { code: '+357', name: 'Cyprus', country: 'CY' },
  { code: '+358', name: 'Finland', country: 'FI' },
  { code: '+359', name: 'Bulgaria', country: 'BG' },
  { code: '+370', name: 'Lithuania', country: 'LT' },
  { code: '+371', name: 'Latvia', country: 'LV' },
  { code: '+372', name: 'Estonia', country: 'EE' },
  { code: '+373', name: 'Moldova', country: 'MD' },
  { code: '+374', name: 'Armenia', country: 'AM' },
  { code: '+375', name: 'Belarus', country: 'BY' },
  { code: '+376', name: 'Andorra', country: 'AD' },
  { code: '+377', name: 'Monaco', country: 'MC' },
  { code: '+378', name: 'San Marino', country: 'SM' },
  { code: '+380', name: 'Ukraine', country: 'UA' },
  { code: '+381', name: 'Serbia', country: 'RS' },
  { code: '+382', name: 'Montenegro', country: 'ME' },
  { code: '+383', name: 'Kosovo', country: 'XK' },
  { code: '+385', name: 'Croatia', country: 'HR' },
  { code: '+386', name: 'Slovenia', country: 'SI' },
  { code: '+387', name: 'Bosnia and Herzegovina', country: 'BA' },
  { code: '+389', name: 'North Macedonia', country: 'MK' },
  { code: '+420', name: 'Czech Republic', country: 'CZ' },
  { code: '+421', name: 'Slovakia', country: 'SK' },
  { code: '+423', name: 'Liechtenstein', country: 'LI' },
  { code: '+500', name: 'Falkland Islands', country: 'FK' },
  { code: '+501', name: 'Belize', country: 'BZ' },
  { code: '+502', name: 'Guatemala', country: 'GT' },
  { code: '+503', name: 'El Salvador', country: 'SV' },
  { code: '+504', name: 'Honduras', country: 'HN' },
  { code: '+505', name: 'Nicaragua', country: 'NI' },
  { code: '+506', name: 'Costa Rica', country: 'CR' },
  { code: '+507', name: 'Panama', country: 'PA' },
  { code: '+508', name: 'Saint Pierre and Miquelon', country: 'PM' },
  { code: '+509', name: 'Haiti', country: 'HT' },
  { code: '+590', name: 'Guadeloupe', country: 'GP' },
  { code: '+591', name: 'Bolivia', country: 'BO' },
  { code: '+592', name: 'Guyana', country: 'GY' },
  { code: '+593', name: 'Ecuador', country: 'EC' },
  { code: '+594', name: 'French Guiana', country: 'GF' },
  { code: '+595', name: 'Paraguay', country: 'PY' },
  { code: '+596', name: 'Martinique', country: 'MQ' },
  { code: '+597', name: 'Suriname', country: 'SR' },
  { code: '+598', name: 'Uruguay', country: 'UY' },
  { code: '+599', name: 'Netherlands Antilles', country: 'AN' },
  { code: '+670', name: 'East Timor', country: 'TL' },
  { code: '+672', name: 'Antarctica', country: 'AQ' },
  { code: '+673', name: 'Brunei', country: 'BN' },
  { code: '+674', name: 'Nauru', country: 'NR' },
  { code: '+675', name: 'Papua New Guinea', country: 'PG' },
  { code: '+676', name: 'Tonga', country: 'TO' },
  { code: '+677', name: 'Solomon Islands', country: 'SB' },
  { code: '+678', name: 'Vanuatu', country: 'VU' },
  { code: '+679', name: 'Fiji', country: 'FJ' },
  { code: '+680', name: 'Palau', country: 'PW' },
  { code: '+681', name: 'Wallis and Futuna', country: 'WF' },
  { code: '+682', name: 'Cook Islands', country: 'CK' },
  { code: '+683', name: 'Niue', country: 'NU' },
  { code: '+685', name: 'Samoa', country: 'WS' },
  { code: '+686', name: 'Kiribati', country: 'KI' },
  { code: '+687', name: 'New Caledonia', country: 'NC' },
  { code: '+688', name: 'Tuvalu', country: 'TV' },
  { code: '+689', name: 'French Polynesia', country: 'PF' },
  { code: '+690', name: 'Tokelau', country: 'TK' },
  { code: '+691', name: 'Micronesia', country: 'FM' },
  { code: '+692', name: 'Marshall Islands', country: 'MH' },
  { code: '+850', name: 'North Korea', country: 'KP' },
  { code: '+852', name: 'Hong Kong', country: 'HK' },
  { code: '+853', name: 'Macau', country: 'MO' },
  { code: '+855', name: 'Cambodia', country: 'KH' },
  { code: '+856', name: 'Laos', country: 'LA' },
  { code: '+880', name: 'Bangladesh', country: 'BD' },
  { code: '+886', name: 'Taiwan', country: 'TW' },
  { code: '+960', name: 'Maldives', country: 'MV' },
  { code: '+961', name: 'Lebanon', country: 'LB' },
  { code: '+962', name: 'Jordan', country: 'JO' },
  { code: '+963', name: 'Syria', country: 'SY' },
  { code: '+964', name: 'Iraq', country: 'IQ' },
  { code: '+965', name: 'Kuwait', country: 'KW' },
  { code: '+966', name: 'Saudi Arabia', country: 'SA' },
  { code: '+967', name: 'Yemen', country: 'YE' },
  { code: '+968', name: 'Oman', country: 'OM' },
  { code: '+970', name: 'Palestine', country: 'PS' },
  { code: '+971', name: 'United Arab Emirates', country: 'AE' },
  { code: '+972', name: 'Israel', country: 'IL' },
  { code: '+973', name: 'Bahrain', country: 'BH' },
  { code: '+974', name: 'Qatar', country: 'QA' },
  { code: '+975', name: 'Bhutan', country: 'BT' },
  { code: '+976', name: 'Mongolia', country: 'MN' },
  { code: '+977', name: 'Nepal', country: 'NP' },
  { code: '+992', name: 'Tajikistan', country: 'TJ' },
  { code: '+993', name: 'Turkmenistan', country: 'TM' },
  { code: '+994', name: 'Azerbaijan', country: 'AZ' },
  { code: '+995', name: 'Georgia', country: 'GE' },
  { code: '+996', name: 'Kyrgyzstan', country: 'KG' },
  { code: '+998', name: 'Uzbekistan', country: 'UZ' },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
}

export default function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Фильтрация по поисковому запросу
  const filteredCodes = countryCodes.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Находим выбранную страну
  const selectedCountry = countryCodes.find((item) => item.code === value) || countryCodes[0];

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-3 glass-subtle rounded-xl text-ink focus:ring-2 focus:ring-a1 outline-none transition-all flex items-center gap-2 min-w-[140px] justify-between hover:glass-strong"
      >
        <span className="text-sm font-medium">{selectedCountry.code}</span>
        <ChevronDown className={`w-4 h-4 text-ink/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 glass rounded-2xl shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Поиск */}
          <div className="p-3 border-b border-ink/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full pl-10 pr-4 py-2 glass-subtle rounded-lg text-ink placeholder-ink/40 focus:ring-2 focus:ring-a1 outline-none text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Список стран */}
          <div className="overflow-y-auto flex-1">
            {filteredCodes.length > 0 ? (
              <div className="py-2">
                {filteredCodes.map((item, index) => (
                  <button
                    key={`${item.code}-${item.country}-${index}`}
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between ${
                      value === item.code
                        ? 'bg-a1/20 text-a1 font-medium'
                        : 'text-ink hover:bg-ink/5'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-ink/60">{item.country}</span>
                    </div>
                    <span className="text-ink/70 font-mono">{item.code}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-ink/60 text-sm">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

