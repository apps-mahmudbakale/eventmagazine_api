import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagazineService } from './magazine.service';
import { MagazineController } from './magazine.controller';
import { Magazine } from './entities/magazine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Magazine])],
  controllers: [MagazineController],
  providers: [MagazineService],
})
export class MagazineModule {}
