// magazine.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { Magazine } from './entities/magazine.entity';

@Controller('magazines')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Post()
  create(@Body() createMagazineDto: CreateMagazineDto): Promise<Magazine> {
    return this.magazineService.create(createMagazineDto);
  }

  @Get()
  findAll(): Promise<Magazine[]> {
    return this.magazineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Magazine> {
    return this.magazineService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMagazineDto: CreateMagazineDto,
  ): Promise<Magazine> {
    return this.magazineService.update(id, updateMagazineDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.magazineService.remove(id);
  }
}