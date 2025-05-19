import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const CarouselBanner = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('w-full max-w-7xl px-20', className)} {...props}>
      <Carousel className="w-full max-w-7xl">
        <CarouselContent>
          <CarouselItem>
            <div className="p-1">
              <Card className="max-w-7xl h-100 p-10">
                <CardHeader>vvv</CardHeader>
                <CardTitle>Some Title</CardTitle>
                <CardDescription>vvv</CardDescription>
                <CardContent>vvv</CardContent>
                <CardFooter>vv</CardFooter>
                {/* <CardContent className=" flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{1}</span>
                </CardContent> */}
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1">
              <Card className="max-w-7xl h-100">
                <CardTitle>Some Title</CardTitle>
                {/* <CardContent className=" flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{1}</span>
                </CardContent> */}
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1">
              <Card className="max-w-7xl h-100">
                {/* <CardContent className=" flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{1}</span>
                </CardContent> */}
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CarouselBanner;
