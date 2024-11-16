import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class LocalCharacterGuard extends AuthGuard('local-author') {}
