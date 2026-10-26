import { InterestLine } from '@/components/interest-line';
import SplitText from '@/components/SplitText';
import { getProfile } from '@/lib/content';
import {HomeNavigation} from '@/components/home-navigation';

export default async function Home() {
  const profile = await getProfile();
  return <section className="introduction home-intro" aria-labelledby="home-title">
      <SplitText tag="h1" id="home-title" text={profile.headline} />
      <InterestLine phrases={profile.interests} description={profile.interestsDescription} />
      <p className="intro-copy">{profile.intro}</p>
      <HomeNavigation links={profile.socialLinks}/>
    </section>;
}
