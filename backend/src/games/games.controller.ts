// src/games/games.controller.ts
import { Controller } from '@nestjs/common';
import { GamesService } from './games.service';
// import { ApiTags, ApiResponse } from '@nestjs/swagger';
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // @Post()
  // @ApiResponse({ status: 201, type: GameResponseDto })
  // async create(@Body() createGameDto: CreateGameDto): Promise<GameResponseDto> {
  //   const game = await this.gamesService.create(createGameDto);
  //   return this.toResponseDto(game);
  // }

  // @Get()
  // @ApiResponse({ status: 200, type: [GameResponseDto] })
  // async findAll(): Promise<GameResponseDto[]> {
  //   const games = await this.gamesService.findAll();
  //   return games.map(this.toResponseDto);
  // }

  // @Get(':id')
  // @ApiResponse({ status: 200, type: GameResponseDto })
  // async findOne(@Param('id') id: string): Promise<GameResponseDto> {
  //   const game = await this.gamesService.findOne(id);
  //   return this.toResponseDto(game);
  // }

  // @Patch(':id')
  // @ApiResponse({ status: 200, type: GameResponseDto })
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateGameDto: UpdateGameDto,
  // ): Promise<GameResponseDto> {
  //   const game = await this.gamesService.update(id, updateGameDto);
  //   return this.toResponseDto(game);
  // }

  // @Delete(':id')
  // @ApiResponse({ status: 200, type: GameResponseDto })
  // async remove(@Param('id') id: string): Promise<GameResponseDto> {
  //   const game = await this.gamesService.remove(id);
  //   return this.toResponseDto(game);
  // }

  // // Преобразование в DTO
  // private toResponseDto(game: Game): GameResponseDto {
  //   return {
  //     id: game._id.toString(),
  //     nameOfTheGame: game.nameOfTheGame,
  //     description: game.description,
  //     minPlayers: game.minPlayers,
  //     maxPlayers: game.maxPlayers,
  //     rules: game.rules,
  //     createdAt: game.createdAt,
  //   };
  // }
}
