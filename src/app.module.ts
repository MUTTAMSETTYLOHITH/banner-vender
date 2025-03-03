import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppResolver } from './app.resolver'
import { ConfigModule } from './common/config/config.module'
import { GraphqlModule } from './common/graphql/graphql.module'
import { DataBaseModule } from './common/database/database'
import { ThrottlerModule } from './common/throttler/throttling.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/users/users.module'
import { PostModule } from './modules/post/post.module'
import { TranslationModule } from './common/translation/translation.module'
import { CommentModule } from './modules/comment/comment.module'
import { LikeModule } from './modules/like/like.module'
import { CampaignModule } from './modules/campaign/campaign.module'
import { PartnerModule } from './modules/partner/partner.module'
import { BannerModule } from './modules/banner/banner.module'

@Module({
  imports: [
    ConfigModule,
    GraphqlModule,
    DataBaseModule,
    ThrottlerModule,
    TranslationModule,

    AuthModule,
    UserModule,
    CampaignModule,
    PartnerModule,
    BannerModule,
    PostModule,
    CommentModule,
    LikeModule,
  ],

  providers: [AppService, AppResolver],
})
export class AppModule {}
