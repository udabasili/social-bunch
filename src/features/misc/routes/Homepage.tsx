import { MainLayout } from "@/components/Layout/MainLayout";
import EventsSummary from "@/features/events/component/EventsSummary";
import GroupsSummary from "@/features/groups/component/GroupsSummary";
import AddPostBox from "@/features/posts/components/AddPostBox";
import Posts from "@/features/posts/components/Posts";
import SuggestedPeople from "@/features/users/components/SuggestedPeople";
import Movie from "./Movie";
import NewBirthday from "./NewBirthday";

export const Homepage = () => {
  
  return (
    <MainLayout>
      <div className="home-page">
        <div className="home-page__aside left">
          <Movie />
          <SuggestedPeople  />
          <NewBirthday />
        </div>
        <div className="home-page__center">
          <AddPostBox />
          <Posts/>
        </div>
        <div className="home-page__aside">
          <GroupsSummary />
          <EventsSummary />
        </div>
      </div>
    </MainLayout>
  );
};
