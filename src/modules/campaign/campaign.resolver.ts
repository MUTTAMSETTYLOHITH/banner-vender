import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql'
import { CampaignService } from './campaign.service'
import { Campaign } from './entity/campaign.entity'
import { RedisService } from 'src/common/redis/redis.service'
import { CreateCampaignCDto } from './dtos/CreateCampaign.dto'
import { CurrentUserDto } from 'src/common/dtos/currentUser.dto'
import { CurrentUser } from 'src/common/decerator/currentUser.decerator'
import { CampaignDto } from './dtos/Campaign.dto'
import { Auth } from 'src/common/decerator/auth.decerator'
import { Role } from 'src/common/constant/enum.constant'
import { CampaignResponse, CampaignsResponse } from './dtos/CampaignResponse'
import { I18nService } from 'nestjs-i18n'

@Resolver(() => Campaign)
export class CampaignResolver {
  constructor (
    private readonly redisService: RedisService,
    private readonly i18n: I18nService,
    private readonly campaignService: CampaignService,
  ) {}

  @Mutation(() => CampaignResponse)
  @Auth(Role.ADMIN, Role.MANAGER)
  async createCampaign (
    @Args('createCampaignDto') createCampaignDto: CreateCampaignCDto,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<CampaignResponse> {
    return await this.campaignService.create(createCampaignDto, user.id)
  }

  @Query(() => CampaignResponse)
  @Auth(Role.USER, Role.PARTNER, Role.ADMIN, Role.MANAGER)
  async getCampaignById (
    @Context() context,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<CampaignResponse> {
    const campaignCacheKey = `campaign:${id}`
    const cachedCampaign = await this.redisService.get(campaignCacheKey)
    if (cachedCampaign instanceof Campaign) {
      return { data: cachedCampaign }
    }

    return await this.campaignService.getCampainById(id)
  }

  @Query(() => CampaignsResponse)
  @Auth(Role.USER, Role.PARTNER, Role.ADMIN, Role.MANAGER)
  async getCampaigns (
    @Args('campaignDto') campaignDto: CampaignDto,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<CampaignsResponse> {
    return await this.campaignService.getCampaign(campaignDto, page, limit)
  }

  @Query(() => CampaignsResponse)
  @Auth(Role.USER, Role.PARTNER, Role.ADMIN, Role.MANAGER)
  async getListCampaigns (
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<CampaignsResponse> {
    return await this.campaignService.listCampaign(page, limit)
  }

  @Mutation(() => CampaignResponse)
  @Auth(Role.USER, Role.PARTNER, Role.ADMIN, Role.MANAGER)
  async UpdateCampaign (
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCampaignDto') updateCampaignDto: CampaignDto,
  ): Promise<CampaignResponse> {
    return await this.campaignService.updateCampaign(id, updateCampaignDto)
  }

  @Mutation(() => CampaignResponse)
  @Auth(Role.ADMIN, Role.MANAGER)
  async deleteCampaign (
    @Args('id', { type: () => Int }) id: number,
  ): Promise<CampaignResponse> {
    return await this.campaignService.deleteCampaign(id)
  }
}
