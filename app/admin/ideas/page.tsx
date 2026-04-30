import { IdeaSubmissionActions } from "@/components/admin/idea-submission-actions";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminIdeaSubmissionsPage() {
  const submissions = await prisma.ideaSubmission.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <section className="section-panel p-6 md:p-8">
      <div>
        <p className="eyebrow">Idea submissions</p>
        <h2 className="font-display text-4xl text-white">
          Custom shirt requests.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
          Every brief submitted from the public custom shirt form appears here.
        </p>
      </div>

      <div className="mt-8 grid gap-5">
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <article key={submission.id} className="admin-order-card">
              <div className="idea-submission-grid">
                <div className="space-y-4">
                  <div>
                    <p className="eyebrow">{formatDate(submission.createdAt)}</p>
                    <h3 className="font-display text-3xl text-white">
                      {submission.reference}
                    </h3>
                    <p className="text-sm leading-7 text-white/52">
                      {submission.name} / {submission.email}
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="admin-list-row">
                      <span>{submission.group}</span>
                      <small>Group / context</small>
                    </div>
                    <div className="admin-list-row">
                      <span>{submission.quantity}</span>
                      <small>Quantity</small>
                    </div>
                  </div>

                  <p className="idea-submission-copy">{submission.concept}</p>
                </div>

                <div className="space-y-4">
                  <div className="idea-submission-image-grid">
                    {submission.images.length > 0 ? (
                      submission.images.map((image, index) => (
                        <a
                          key={`${submission.id}-${index}`}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
                          className="idea-submission-image"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={`${submission.reference} upload ${index + 1}`}
                          />
                        </a>
                      ))
                    ) : (
                      <div className="idea-submission-empty">No images attached</div>
                    )}
                  </div>

                  <IdeaSubmissionActions
                    submissionId={submission.id}
                    status={submission.status}
                  />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-order-card">
            <p className="eyebrow">No ideas yet</p>
            <h3 className="mt-3 font-display text-3xl text-white">
              Custom shirt requests will appear here.
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
