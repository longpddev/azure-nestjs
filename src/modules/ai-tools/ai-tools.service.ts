import { Injectable } from '@nestjs/common';
import { Calculator } from 'langchain/tools/calculator';
import { SerpAPI } from 'langchain/tools';
@Injectable()
export class AiToolsService {
  private _tools = [new Calculator(), new SerpAPI()];
  get tools() {
    return this._tools;
  }
}
