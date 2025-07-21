// src/core/entities/product.entity.ts
export class Product {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public category: string,
  ) {}

  reduceStock(quantity: number): void {
    if (this.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }
}
