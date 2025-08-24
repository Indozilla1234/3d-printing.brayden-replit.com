{ pkgs }: {
  deps = [
    pkgs.nodejs_18
    pkgs.nodePackages.pnpm
    pkgs.nodePackages.npm
  ];
}
