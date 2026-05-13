const seedPosts = [
  {
    title: "Welcome to TayTech Insights",
    category: "News",
    author: "Admin",
    content: "This platform is now live for posting personal news, industry insights, and thoughtful opinions.",
    date: "2026-05-13T08:00:00.000Z"
  },
  {
    title: "What I'm Learning About Consistency",
    category: "Insight",
    author: "Admin",
    content: "Small daily progress in writing and reflecting leads to stronger, clearer opinions over time.",
    date: "2026-05-12T15:30:00.000Z"
  },
  {
    title: "Opinion: Community Drives Better Ideas",
    category: "Opinion",
    author: "Admin",
    content: "Sharing personal viewpoints in public helps challenge assumptions and build better conclusions together.",
    date: "2026-05-11T10:15:00.000Z"
  }
];

const storageKey = "taytechinsights-posts";
const form = document.getElementById("post-form");
const postList = document.getElementById("posts");
const featuredStory = document.getElementById("featured-story");
const filter = document.getElementById("filter");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");

const readPosts = () => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return seedPosts;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : seedPosts;
  } catch {
    return seedPosts;
  }
};

let posts = readPosts();

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

const sortPosts = (list) =>
  [...list].sort((a, b) => new Date(b.date) - new Date(a.date));

const renderFeatured = (list) => {
  const topPost = sortPosts(list)[0];
  if (!topPost) {
    featuredStory.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  featuredStory.innerHTML = `
    <p class="badge">${escapeHtml(topPost.category)}</p>
    <h3>${escapeHtml(topPost.title)}</h3>
    <p class="post-meta">By ${escapeHtml(topPost.author)} • ${formatDate(topPost.date)}</p>
    <p>${escapeHtml(topPost.content)}</p>
  `;
};

const renderPosts = () => {
  const selected = filter.value;
  const filtered = selected === "All" ? posts : posts.filter((post) => post.category === selected);
  const ordered = sortPosts(filtered);

  if (!ordered.length) {
    postList.innerHTML = "<p>No posts match this category yet.</p>";
    return;
  }

  postList.innerHTML = ordered
    .map(
      (post) => `
      <article class="post-card">
        <p class="badge">${escapeHtml(post.category)}</p>
        <h3>${escapeHtml(post.title)}</h3>
        <p class="post-meta">By ${escapeHtml(post.author)} • ${formatDate(post.date)}</p>
        <p>${escapeHtml(post.content)}</p>
      </article>
    `
    )
    .join("");
};

const persist = () => localStorage.setItem(storageKey, JSON.stringify(posts));

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const author = document.getElementById("author").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !author || !content) return;

  posts = sortPosts([
    ...posts,
    {
      title,
      category,
      author,
      content,
      date: new Date().toISOString()
    }
  ]);

  persist();
  form.reset();
  filter.value = "All";
  renderFeatured(posts);
  renderPosts();
});

filter.addEventListener("change", renderPosts);
document.getElementById("year").textContent = new Date().getFullYear();

renderFeatured(posts);
renderPosts();
