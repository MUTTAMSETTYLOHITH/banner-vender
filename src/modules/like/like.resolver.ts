import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { Role } from 'src/common/constant/enum.constant'
import { Auth } from 'src/common/decerator/auth.decerator'
import { CurrentUser } from 'src/common/decerator/currentUser.decerator'
import { CurrentUserDto } from 'src/common/dtos/currentUser.dto'
import { LikeService } from './like.service'
import { Like } from './entity/like.entity '
import { LikeResponse, LikesResponse } from './dto/like.response'
import { RedisService } from 'src/common/redis/redis.service'
import { LikesInputResponse } from './input/like.input'

@Resolver(() => Like)
export class LikeResolver {
  constructor (
    private readonly redisService: RedisService,
    private readonly likeService: LikeService,
  ) {}

  @Mutation(() => LikeResponse)
  @Auth(Role.USER)
  async likePost (
    @CurrentUser() user: CurrentUserDto,
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<LikeResponse> {
    return this.likeService.likePost(user.id, postId)
  }

  @Mutation(() => String)
  @Auth(Role.USER)
  async unlikePost (
    @CurrentUser() user: CurrentUserDto,
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<string> {
    return this.likeService.unLikePost(user.id, postId)
  }

  @Query(() => LikesResponse)
  @Auth(Role.USER)
  async likedUser (
    @CurrentUser() user: CurrentUserDto,
    @Args('page', { type: () => Int, nullable: true }) page: number,
    @Args('limit', { type: () => Int, nullable: true }) limit: number,
  ): Promise<LikesResponse> {
    const likeCacheKey = `like-user:${user.id}`
    const cachedLike = await this.redisService.get(likeCacheKey)
    if (cachedLike instanceof LikesInputResponse) {
      return { ...cachedLike }
    }

    return this.likeService.userPostLikes(user.id, page, limit)
  }

  @Query(() => LikeResponse)
  @Auth(Role.USER)
  async postLikeCount (
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<LikeResponse> {
    return this.likeService.numPostLikes(postId)
  }
}
