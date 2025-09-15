import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Search, Filter, Eye, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold">Neetrino</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
              Каталог
            </Link>
            <Link href="/vendors" className="text-sm font-medium hover:text-primary transition-colors">
              Бренды
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Админка
            </Link>
          </nav>
          <Button asChild>
            <Link href="/catalog">Начать поиск</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Найдите идеальный{' '}
            <span className="text-primary">дизайн</span>
            <br />
            для вашего проекта
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Тысячи демо-сайтов от ведущих дизайнеров. 
            Просматривайте, анализируйте и вдохновляйтесь.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/catalog">
                Выбрать дизайн
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/vendors">Посмотреть бренды</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Поиск</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Используйте фильтры и поиск для нахождения подходящих демо
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">2. Фильтрация</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Сортируйте по брендам, категориям и популярности
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">3. Просмотр</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Изучайте демо в разных разрешениях экрана
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">4. Вдохновение</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Открывайте оригинальные сайты для детального изучения
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Демо-сайтов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Брендов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Обновления</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к тысячам дизайнеров, которые уже нашли свой идеальный дизайн
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/catalog">
              Начать поиск
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Neetrino Platform. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
