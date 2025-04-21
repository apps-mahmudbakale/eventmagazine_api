// magazine.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Magazine } from './entities/magazine.entity';
import { CreateMagazineDto } from './dto/create-magazine.dto';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(Magazine)
    private magazineRepository: Repository<Magazine>,
  ) {}

  async create(createMagazineDto: CreateMagazineDto): Promise<Magazine> {
    const magazine = this.magazineRepository.create(createMagazineDto);
    return this.magazineRepository.save(magazine);
  }

  async findAll(): Promise<Magazine[]> {
    return this.magazineRepository.find();
  }

  async findOne(id: number): Promise<Magazine> {
    return this.magazineRepository.findOneBy({ id });
  }

  async update(id: number, updateMagazineDto: CreateMagazineDto): Promise<Magazine> {
    await this.magazineRepository.update(id, updateMagazineDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.magazineRepository.delete(id);
  }
}