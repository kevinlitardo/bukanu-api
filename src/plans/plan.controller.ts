import { Controller, Get } from '@nestjs/common';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async getUserPlan() {
    return this.planService.getPlans();
  }
}
