import { Injectable } from '@nestjs/common';
import { Calculator } from 'langchain/tools/calculator';
import { BingSerpAPI, SerpAPI } from 'langchain/tools';
@Injectable()
export class AiToolsService {
  private _tools = [new Calculator(), new BingSerpAPI()];
  get tools() {
    return this._tools;
  }
}
