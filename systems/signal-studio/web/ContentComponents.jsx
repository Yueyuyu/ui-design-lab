import { ArrowRight } from '@phosphor-icons/react';

export function SignalStoryCard({ story, featured = false, onOpen, disabled = false }) {
  const Surface = onOpen ? 'button' : 'article';
  return <Surface className="ss-story" type={onOpen ? 'button' : undefined} data-featured={featured} disabled={onOpen ? disabled : undefined} onClick={onOpen ? () => onOpen(story) : undefined}>
    {featured ? <img src={story.image} alt={`${story.title} 原创内容封面`}/> : <><span className="ss-story-copy"><small>{story.status.toUpperCase()}</small><strong>{story.title}</strong><span>{story.description}</span></span><img src={story.image} alt={`${story.title} 原创内容封面`}/></>}
    {featured && <span className="ss-feature-action"><strong>{story.title}</strong><span>{story.description}</span><span><ArrowRight size={18} aria-hidden="true"/> Continue story</span></span>}
  </Surface>;
}
export function SignalRevisionList({ stories = [], onOpen }) {
  return <ul className="ss-revisions">{stories.length ? stories.map(story => <li key={story.id}><img src={story.image} alt=""/>{onOpen ? <button type="button" onClick={() => onOpen(story)}>{story.title}</button> : <strong>{story.title}</strong>}<span>{story.description}</span><span>{story.owner}</span><time>{story.updatedAt ?? '更新时间未记录'}</time></li>) : <li>还没有修订记录。</li>}</ul>;
}
