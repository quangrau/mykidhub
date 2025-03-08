import { db } from "@/lib/database/prisma.service";
import { notFound } from "next/navigation";

interface FeedPageProps {
  params: {
    id: string;
  };
}

async function getStudentFeed(id: string) {
  const student = await db.student.findUnique({
    where: { id },
    include: {
      childrenGuardian: {
        include: {
          member: true,
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  // Get all guardian member IDs for this student
  const guardianMemberIds = student.childrenGuardian
    .map((g) => g.memberId)
    .filter(Boolean);

  // Fetch posts where any of the student's guardians are in the audience
  const posts = await db.post.findMany({
    where: {
      audiences: {
        some: {
          memberId: {
            in: guardianMemberIds as string[],
          },
        },
      },
    },
    include: {
      author: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          author: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return { student, posts };
}

export default async function FeedPage({ params }: FeedPageProps) {
  const { id } = await params;
  const { posts } = await getStudentFeed(id);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {post.author.user.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{post.type}</span>
            </div>
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground">{post.content}</p>
          </div>

          {post.comments.length > 0 && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <h4 className="text-sm font-medium">Comments</h4>
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {comment.author.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {posts.length === 0 && (
        <div className="text-center text-muted-foreground">
          No posts available for this student.
        </div>
      )}
    </div>
  );
}
