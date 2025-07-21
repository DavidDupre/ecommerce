// src/infrastructure/web/product.controller.ts
import { ProductRepository } from '@core/ports/product.repository.port';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';

@Controller('productos')
export class ProductController {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  @Get()
  async getProducts(
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productRepository.findAll({
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  }

  @Get(':id')
  async obtenerProducto(@Param('id') id: string) {
    return this.productRepository.findById(id);
  }
}
