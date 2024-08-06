import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NATS_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.natsClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError((e) => {
          throw new RpcException(e);
        }),
      );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.natsClient
      .send({ cmd: 'find_all_products' }, { ...paginationDto })
      .pipe(
        catchError((e) => {
          throw new RpcException(e);
        }),
      );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((e) => {
        throw new RpcException(e);
      }),
    );
    // try {
    //   return await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id }),
    //   );
    // } catch (e) {
    //   throw new RpcException(e);
    // }
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((e) => {
        throw new RpcException(e);
      }),
    );
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.natsClient
      .send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError((e) => {
          throw new RpcException(e);
        }),
      );
  }
}
