import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';

export class OrderDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;
}
export class ApproveOrderDto {
  @IsBoolean()
  isApproved: boolean;
}

export class PurchaseDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class PublishMessageDto {
  @IsString()
  message: string;
}

export class SetStateDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
