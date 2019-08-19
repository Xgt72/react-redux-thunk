import React from 'react';
import PropTypes from 'prop-types';

import { ArticleContainer } from '.';

const ArticleList = ({ articles }) => (
  <ul>
    {articles.map(article => (
      <ArticleContainer
        isSelected={article.isSelected}
        key={article.name}
        name={article.name}
        weight={article.weight}
      />
    ))}
  </ul>
);

ArticleList.propTypes = {
  articles: PropTypes.array.isRequired,
};

export default ArticleList;
