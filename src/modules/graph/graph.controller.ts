import { Controller, Get } from '@nestjs/common';
import { GraphService } from './graph.service';
import { UtilisateurCourant } from '../../common/decorators/utilisateur-courant.decorator';

@Controller('graph')
export class GraphController {
  constructor(private service: GraphService) {}

  @Get()
  getGraphData(@UtilisateurCourant('entrepriseId') entrepriseId: string) {
    return this.service.getGraphData(entrepriseId);
  }
}
