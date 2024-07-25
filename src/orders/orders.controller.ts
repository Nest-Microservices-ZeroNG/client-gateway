import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateOrderDto,
  OrderPaginationDto,
  OrderStatusDto,
  UpdateOrderDto,
} from './dto';
import { ORDER_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '../common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await firstValueFrom(
        this.ordersClient.send('createOrder', createOrderDto),
      );
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: OrderPaginationDto) {
    try {
      return await firstValueFrom(
        this.ordersClient.send('findAllOrders', paginationDto),
      );
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @Get(':status')
  async findAllProductsByStatus(
    @Param() status: OrderStatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return await firstValueFrom(
        this.ordersClient.send('findAllOrders', {
          ...paginationDto,
          ...status,
        }),
      );
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id }),
      );
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @Patch(':id')
  async changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() status: OrderStatusDto,
  ) {
    try {
      return await firstValueFrom(
        this.ordersClient.send('changeOrderStatus', { id, ...status }),
      );
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
