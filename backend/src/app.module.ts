import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { IdeasModule } from './ideas/ideas.module';
import { UploadController } from './upload.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { Idea, IdeaSchema } from './schemas/idea.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        process.env.MONGO_URL ||
        'mongodb://127.0.0.1:27017/lovesa',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Idea.name, schema: IdeaSchema },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    UsersModule,
    AuthModule,
    ActivitiesModule,
    IdeasModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
