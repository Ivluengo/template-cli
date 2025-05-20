import { execSync } from 'child_process';

export default function getLatestPackageVersions(pkg) {
  try {
    const output = execSync(`npm view ${pkg} version`);
    return '^' + output.toString().trim();
  } catch (error) {
    console.log(`Error getting latest version for ${pkg}`);
    return '*';
  }
}
