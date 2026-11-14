import PageHero from "./PageHero";
import ContentGrid, { type ContentItem } from "./ContentGrid";

type Props = { title: string; intro: string; items: ContentItem[]; failed: boolean; emptyText: string };

export default function ListPage({ title, intro, items, failed, emptyText }: Props) {
  return (
    <>
      <PageHero title={title} intro={intro} />
      <section className="section">
        <div className="container-site">
          <ContentGrid items={items} failed={failed} emptyText={emptyText} />
        </div>
      </section>
    </>
  );
}
