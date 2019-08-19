import { connect } from "react-redux";
import { Weight } from ".";

const getSelectedArticlesTotalWeight = articles =>
    articles
        .filter(article => article.isSelected)
        .reduce((sum, article) => sum + article.weight, 0);

const mapStateToPorps = ({ articles }) => ({
    value: getSelectedArticlesTotalWeight(articles),
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToPorps,
    mapDispatchToProps
)(Weight);