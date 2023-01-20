exports.data = {
	permalink: 'index.xml',
}

const getEpisodes = async (data) => {
	const episode = data.collections.episode;
	const result = await Promise.all(episode.map(
		async episode => `
		   <item>
			   <title>${ episode.data.title }</title>
			   <link>${ data.meta.url }${ episode.fileSlug }/</link>
			   <pubDate>${ episode.date.toUTCString() }</pubDate>
			   <description><![CDATA[<ul>${
				   episode.data.chapters
					   .map(chapter => `<li>${ chapter.time } ${ chapter.title }</li>`)
					   .join('')
			   }</ul><ul>${
				   episode.data.hosts
					   .map(host => `<li>${ host }</li>`)
					   .join('')
			   }</ul>${
				   this.htmlmin(episode.content)
			   }]]></description>
			   <guid isPermaLink="true">${ data.meta.url }episodes/${ episode.fileSlug }.mp3</guid>
			   <enclosure
				   type="audio/mpeg"
				   url="${ data.meta.url }episodes/${ episode.fileSlug }.mp3"
				   length="${await this.duration(`src/mp3/${ episode.fileSlug }.mp3`) }"
			   />
			   <itunes:episode>${ episode.fileSlug }</itunes:episode>
			   <itunes:duration>${
				   await this.duration(`src/mp3/${ episode.fileSlug }.mp3`)
			   }</itunes:duration>
			   <itunes:author>${
				   episode.data.hosts
					   .map(host => host)
					   .join(', ')
			   }</itunes:author>
			   <itunes:explicit>${ data.meta.explicit }</itunes:explicit>
			   <itunes:summary>${
				   episode.date.toLocaleString('ru', {
					   year: 'numeric',
					   month: 'long',
					   day: 'numeric'
				   }).replace(' г.', '')
			   }: ${
				   episode.data.title
			   }. ${
				   episode.data.hosts
					   .map(host => host)
					   .join(', ')
			   }</itunes:summary>
			   <itunes:image href="${ data.meta.url }cover.png"/>
		   </item>
	   `
   ))
   return result.join('');
}

exports.render = async function(data) {
	return `
		<?xml version="1.0" encoding="utf-8"?>
		<rss
			xmlns:atom="http://www.w3.org/2005/Atom"
			xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
			version="2.0"
		>
			<channel>
				<title>${ data.meta.title }</title>
				<description>${ data.meta.description }</description>
				<copyright>${ data.meta.copyright }</copyright>
				<language>${ data.meta.language }</language>
				<link>${ data.meta.url }</link>
				<atom:link href="${ data.meta.url }feed/" rel="self" type="application/rss+xml"/>
				<itunes:subtitle>${ data.meta.subtitle }</itunes:subtitle>
				<itunes:type>${ data.meta.type }</itunes:type>
				<itunes:author>${
					data.meta.hosts
						.map(host => host)
						.join(', ')
				}</itunes:author>
				<itunes:explicit>${ data.meta.explicit }</itunes:explicit>
				<itunes:owner>
					<itunes:name>${ data.meta.owner.name }</itunes:name>
					<itunes:email>${ data.meta.owner.email }</itunes:email>
				</itunes:owner>
				<itunes:image href="${ data.meta.url }cover.png"/>
				<itunes:category text="${ data.meta.category }">
					<itunes:category text="${ data.meta.subcategory }"/>
				</itunes:category>
				${await getEpisodes(data)}
			</channel>
		</rss>
	`;
};
