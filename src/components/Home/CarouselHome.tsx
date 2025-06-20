import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Course = {
  id: number;
  title: string;
  description: string;
  tool: string;
  level: string;
  url: string;
};

type CarouselHomeProps = {
  items: Course[];
  className?: string;
};

export function CarouselHome({ items, className }: CarouselHomeProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto`}>
      <Carousel>
        <div className="relative">
          <CarouselContent>
            {items.map((course) => (
              <CarouselItem
                key={course.id}
                className="basis-1/3 max-w-[33.3333%] flex-shrink-0"
              >
                <Card className="w-full shadow border h-full">
                  <CardContent className="w-full h-full flex flex-col items-center">
                    <div className="flex flex-col flex-1">
                      <div>
                        <div className="carousel-course-title">{course.title}</div>
                      </div>
                      <div className="flex-1" />
                      <div>
                        <div className="carousel-course-meta mb-2 flex gap-2 items-center flex-wrap">
                          <span>{course.tool}</span>
                          <span className="dot">•</span>
                          <span>
                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                          </span>
                        </div>
                        <a
                          className="carousel-course-btn"
                          href={course.url}
                          style={{ width: "100%" }}
                        >
                          Ir para o curso
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Setas abaixo dos cards */}
          <div className="flex justify-center gap-4 mt-4">
            <CarouselPrevious className="static relative translate-y-0" />
            <CarouselNext className="static relative translate-y-0" />
          </div>
        </div>
      </Carousel>
    </div>
  );
}