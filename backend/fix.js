const fs = require('fs');

function replaceFile(path, from, to) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(path, content);
  }
}

// Fix controllers
replaceFile('src/activities/activities.controller.ts', /@Request\(\) req/g, '@Request() req: any');
replaceFile('src/ideas/ideas.controller.ts', /@Request\(\) req/g, '@Request() req: any');
replaceFile('src/auth/auth.controller.ts', /@Request\(\) req/g, '@Request() req: any');

// Fix services return types
replaceFile('src/activities/activities.service.ts', /Promise<Activity>/g, 'Promise<ActivityDocument>');
replaceFile('src/activities/activities.service.ts', /Promise<Activity\[\]>/g, 'Promise<ActivityDocument[]>');
replaceFile('src/ideas/ideas.service.ts', /Promise<Idea>/g, 'Promise<IdeaDocument>');
replaceFile('src/ideas/ideas.service.ts', /Promise<Idea\[\]>/g, 'Promise<IdeaDocument[]>');

// Fix auth service _id
replaceFile('src/auth/auth.service.ts', /user\._id/g, '(user as any)._id');

// Fix schemas
replaceFile('src/schemas/activity.schema.ts', /userId: User;/g, 'userId: string;');
replaceFile('src/schemas/idea.schema.ts', /userId: User;/g, 'userId: string;');

console.log('Fixes applied successfully!');
