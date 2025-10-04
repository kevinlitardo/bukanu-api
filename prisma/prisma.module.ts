import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // lo hace accesible sin re-importar en cada módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
