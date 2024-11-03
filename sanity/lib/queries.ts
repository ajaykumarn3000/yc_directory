import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
  _id, title, slug, _createdAt, author ->{
    _id, image, name, bio
  }, views, description, category, image
}`);

export const STARTUP_BY_ID_QUERY =
  defineQuery(`*[_type == "startup" && _id==$id][0]{
  _id, title, slug, _createdAt, author ->{
    _id, image, name,username, bio
  }, views, description, category, image, pitch
}`);
// {/* CHANGE TO NAME */}

export const STARTUP_VIEWS_QUERY = defineQuery(
  `*[_type == "startup" && _id==$id][0]{_id, views}`
);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && id == $id][0]{
    _id, 
    id,
    name,
    user,
    email,
    image,
    bio
  }  
`);
