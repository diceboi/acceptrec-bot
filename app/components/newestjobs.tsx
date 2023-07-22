"use client"

export const dynamic = "force-dynamic";

import JobTile from "./jobtile";
import { FaFire } from "react-icons/fa";
import { HiArrowSmRight } from "react-icons/hi";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from '@apollo/client';

const query = gql`query GET_JOBS {
  posts(where: {categoryName: "Jobs"}) {
    edges {
      node {
        jobs {
          category
          contractType
          fieldGroupName
          longDescription
          region
          salary
          salary2
          shortDescription
          type
        }
        date
        title
        slug
      }
    }
  }
}`;

interface JobData {
  category: string[];
  contractType: string;
  fieldGroupName: string;
  longDescription: string;
  region: string;
  salary: number;
  salary2?: number | null;
  shortDescription: string;
  type: string;
}

interface Edge {
  node: {
    jobs: JobData;
    date: string;
    title: string;
    slug: string;
  };
}

interface Data {
  posts: {
    edges: Edge[];
  };
}

export default function NewestJobs() {

  const { data } = useSuspenseQuery<Data>(query);

  if (!data) {
    // Handle the case when data is still loading or undefined
    return null; // Or you can return a loading spinner or a message
  }

  const edges: Edge[] = data.posts.edges;

  return (
    <>
      <section className="flex flex-col justify-center items-center w-full">
        <div className="w-10/12 lg:w-8/12 -mt-[9vh] z-40 border border-neutral-300 rounded-xl">
          <div className="flex items-center gap-2 py-4 my-2 ml-8">
            <FaFire className="text-[#ff914d] w-10 h-10" />
            <h2 className="text-3xl font-black justify-start uppercase tracking-tighter">New Jobs</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 w-full bg-white px-8">
            {edges.map((edge) => (
              <JobTile key={edge.node.slug} jobData={edge.node} />
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 py-4 my-2">
            <button className="relative flex justify-between items-center w-full lg:w-auto py-2 px-4 font-bold rounded-full gap-4 hover:underline group transition-all">More jobs<HiArrowSmRight className="absolute -right-2 group-hover:-right-4 transition-all" /></button>
          </div>
        </div>
      </section>
    </>
  )
}
