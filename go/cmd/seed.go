package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"github.com/harbor-ml/modelzoo/go/db"
)

var dataPath *string

// seedCmd represents the seed command
var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("seed called", "loading...", *dataPath)
		db.Seed(*dataPath)
	},
}

func init() {
	rootCmd.AddCommand(seedCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// seedCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	dataPath = seedCmd.Flags().String("data", "", "Path to models.json")
	seedCmd.MarkFlagRequired("data")
}
