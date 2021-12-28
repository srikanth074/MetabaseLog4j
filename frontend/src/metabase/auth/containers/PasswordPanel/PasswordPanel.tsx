import { connect } from "react-redux";
import { login } from "../../actions";
import PasswordPanel from "../../components/PasswordPanel";
import { getExternalAuthProviders } from "metabase/auth/selectors";

const mapStateToProps = () => ({
  providers: getExternalAuthProviders(),
});

const mapDispatchToProps = {
  onLogin: login,
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPanel);
