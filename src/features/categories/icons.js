import {
  Heart, Dumbbell, Book, Apple, Music, Code, Coffee,
  Moon, Sun, Bike, Pen, Brain, Star, Zap, Leaf, Trophy,
} from 'lucide-react'

export const CATEGORY_ICONS = [
  { name: 'heart',    Icon: Heart    },
  { name: 'dumbbell', Icon: Dumbbell },
  { name: 'book',     Icon: Book     },
  { name: 'apple',    Icon: Apple    },
  { name: 'music',    Icon: Music    },
  { name: 'code',     Icon: Code     },
  { name: 'coffee',   Icon: Coffee   },
  { name: 'moon',     Icon: Moon     },
  { name: 'sun',      Icon: Sun      },
  { name: 'bike',     Icon: Bike     },
  { name: 'pen',      Icon: Pen      },
  { name: 'brain',    Icon: Brain    },
  { name: 'star',     Icon: Star     },
  { name: 'zap',      Icon: Zap      },
  { name: 'leaf',     Icon: Leaf     },
  { name: 'trophy',   Icon: Trophy   },
]

/**
 * Retorna o componente de ícone pelo nome, ou null se não encontrado.
 * @param {string|null} name
 * @returns {import('react').ComponentType | null}
 */
export function getIcon(name) {
  return CATEGORY_ICONS.find((i) => i.name === name)?.Icon ?? null
}
