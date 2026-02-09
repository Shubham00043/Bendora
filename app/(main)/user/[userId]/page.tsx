
import { db } from "@/db";
import { users, learningGoals, communities, communityMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MapPin, Calendar, Briefcase } from "lucide-react";

export default async function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
        learningGoals: true,
        communityMemberships: {
           with: {
               community: true
           }
        }
    }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <UserAvatar 
                name={user.name} 
                imageUrl={user.imageUrl ?? undefined} 
                size="lg" 
                className="w-32 h-32 text-4xl"
            />
            <div className="flex-1 text-center md:text-left space-y-2">
               <h1 className="text-3xl font-bold">{user.name}</h1>
               <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                   <p className="font-medium">@{user.username}</p>
                   <span>•</span>
                   <p className="flex items-center gap-1">
                       <Calendar className="size-4" />
                       Joined {new Date(user.createdAt).toLocaleDateString()}
                   </p>
               </div>
               
               <p className="text-lg max-w-2xl">
                 Software Engineer passionate about building scalable web applications. currently learning AI/ML.
               </p>

               <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                   <Badge variant="secondary" className="px-3 py-1">
                      <Briefcase className="size-3 mr-2" />
                      Frontend Developer
                   </Badge>
                   <Badge variant="secondary" className="px-3 py-1">
                      <MapPin className="size-3 mr-2" />
                      San Francisco, CA
                   </Badge>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar Info */}
          <div className="space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">Communities</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-3">
                          {user.communityMemberships.map((membership: any) => (
                              <div key={membership.community.id} className="flex items-center gap-3">
                                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <span className="font-bold text-primary">{membership.community.name[0]}</span>
                                  </div>
                                  <span className="font-medium text-sm">{membership.community.name}</span>
                              </div>
                          ))}
                          {user.communityMemberships.length === 0 && (
                              <p className="text-sm text-muted-foreground">No communities yet.</p>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <BookOpen className="size-5 text-primary" />
                          Learning Goals
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="grid gap-4">
                          {user.learningGoals.map((goal) => (
                              <div key={goal.id} className="p-4 rounded-lg bg-muted/30 border">
                                  <h3 className="font-semibold text-lg mb-1">{goal.title}</h3>
                                  <p className="text-muted-foreground mb-3">{goal.description}</p>
                                  <div className="flex flex-wrap gap-2">
                                      {goal.tags.map((tag: string) => (
                                          <Badge key={tag} variant="outline" className="text-xs">
                                              #{tag}
                                          </Badge>
                                      ))}
                                  </div>
                              </div>
                          ))}
                          {user.learningGoals.length === 0 && (
                              <p className="text-center py-8 text-muted-foreground">
                                  No learning goals set yet.
                              </p>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
